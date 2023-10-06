import { Env } from "../..";
import { userDbGet, userDbUpdate } from "../repositories/userRepo";
import { utilFailedResponse, utilGenerateRandomCode } from "./utilService";
import { userGet } from "./userService";
import { messageSend } from "./messageService";
import { MessageSend } from "../models/MessageModel";

export async function authGetPhoneToken(params: { userId: number }, env: Env) {
  // Get user
  const user = await userGet(params, env);

  // Check if user has phone number
  if (!user.phone) {
    throw utilFailedResponse("Cannot find phone number", 404);
  }

  // Check if user has verified phone number
  if (user.phoneVerifiedAt) {
    throw utilFailedResponse("Phone number already verified", 400);
  }

  // Check if user has sent phone token in the last 60 seconds
  const lastSent = await env.KV.get(user.phone);
  if (lastSent && Date.now() - Number(lastSent) < 60 * 1000) {
    throw utilFailedResponse(
      "Please wait 60 seconds before sending again",
      400
    );
  }

  // Generate 6 digits token
  const randomToken = utilGenerateRandomCode();

  // Save token to KV
  const data = {
    type: "phone",
    userId: user.id,
    exp: new Date().getTime() + 1000 * 60 * 5,
  };
  await env.KV.put(randomToken, JSON.stringify(data));

  // Send message
  const message: MessageSend = {
    userId: user.id,
    phone: user.phone,
    messageTemplateId: 2,
    templateValues: JSON.stringify({ code: randomToken }),
  };

  let isSuccess = false;
  let retry = 0;
  while (!isSuccess && retry < 5) {
    try {
      await messageSend(message, env, 1);
      isSuccess = true;
    } catch (e) {
      retry += 1;
    }
  }

  if (!isSuccess) {
    throw utilFailedResponse("Failed to send message", 500);
  }

  return true;
}

export async function authValidatePhoneToken(
  params: { token: string; userId: number },
  env: Env
) {
  // Get token from KV
  const data = await env.KV.get(params.token);
  if (!data) {
    throw utilFailedResponse("Invalid token", 400);
  }

  // Validate token
  const parsedData = JSON.parse(data);
  if (parsedData.type !== "phone") {
    throw utilFailedResponse("Invalid token", 400);
  } else if (parsedData.exp < new Date().getTime()) {
    throw utilFailedResponse("Expired token", 400);
  } else if (parsedData.userId !== params.userId) {
    throw utilFailedResponse("Invalid token", 400);
  }

  // Get user
  const user = await userDbGet({ userId: params.userId }, env);
  if (!user) {
    throw utilFailedResponse("Cannot find user", 404);
  }
  // Verify user phone
  user.phoneVerifiedAt = new Date().getTime();
  // Update user
  const update = await userDbUpdate(user, env);
  if (!update) {
    throw utilFailedResponse("Error", 500);
  }

  // Delete token from KV
  await env.KV.delete(params.token);

  return true;
}
