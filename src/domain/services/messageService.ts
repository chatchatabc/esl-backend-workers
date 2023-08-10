import { Env } from "../..";
import { Message, MessageCreate } from "../models/MessageModel";
import {
  messageDbCreate,
  messageDbGetAll,
  messageDbGetAllTotal,
} from "../repositories/messageRepo";
import { utilFailedResponse } from "./utilService";

const baseUrl = "https://smsv2.market.alicloudapi.com/sms/sendv2";

/**
 * Send a message to the given mobile number
 * @param params {content: string, mobile: string}
 * @returns {Promise<null|Response>}
 * @seeMore https://market.aliyun.com/products/57000002/cmapi00046952.html
 */
export async function messageSend(params: { content: string; mobile: string }) {
  const request = {
    method: "GET",
    headers: {
      Authorization: "APPCODE b567b7be3fe7490c853ef2b222623294",
    },
  };

  // Remove the country code
  params.mobile = params.mobile.replace("+86", "");

  const url = new URL(baseUrl);
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url, request);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function messageCreate(params: MessageCreate, env: Env) {
  const query = messageDbCreate(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to save message", 500);
  }

  return true;
}

export async function messageGetAll(
  params: { page: number; size: number },
  env: Env
) {
  const query = await messageDbGetAll(params, env);
  if (!query) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  const total = await messageDbGetAllTotal(env);
  if (!total) {
    throw utilFailedResponse("Unable to get messages", 500);
  }

  return {
    ...params,
    content: query.results as Message[],
    total,
  };
}
