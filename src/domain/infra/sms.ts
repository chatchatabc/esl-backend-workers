import { Env } from "../..";
import { SmsSend } from "../models/SmsModel";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const accessKeyId = "LTAI5tGiV15PDjkXDRhV9yRE";
const accessKeySecret = "E9GPX1SGW6SPMWp52mer71E6oMxZ45";
const smsVersion = "2017-05-25";

/*
 * Reference: https://help.aliyun.com/zh/iot/developer-reference/request-signatures
 * They have different rules for their url encoding.
 */
function smsUrlEncoder(text: string) {
  // replace "%2B" to "%20", and "%7E" to "~"
  return encodeURIComponent(text).replace(/%2B/g, "%20").replace(/%7E/g, "~");
}

/*
 * Getting the string to sign according to the rules.
 * Reference: https://help.aliyun.com/zh/iot/developer-reference/request-signatures
 */
function smsStringToSign(params: {
  method: "GET" | "POST";
  queryString: string;
}) {
  const { method, queryString } = params;
  const encodedQueryString = smsUrlEncoder(queryString);
  return `${method}&%2F&${encodedQueryString}`;
}

/*
 * Getting the signature according to the rules.
 * Reference: https://help.aliyun.com/zh/iot/developer-reference/request-signatures
 */
function smsSignature(params: {
  accessKeySecret: string;
  stringToSign: string;
}) {
  const { accessKeySecret, stringToSign } = params;
  let hmac = CryptoJS.algo.HMAC.create(
    CryptoJS.algo.SHA1,
    `${accessKeySecret}&`
  );
  hmac.update(stringToSign);
  return hmac.finalize().toString(CryptoJS.enc.Base64);
}

/*
 * OpenAPI Reference: https://help.aliyun.com/zh/sdk/product-overview/rpc-mechanism
 * Authorization Reference: https://next.api.aliyun.com/document/Dysmsapi/2017-05-25/ram
 * General Reference: https://next.api.aliyun.com/document/Dysmsapi/2017-05-25/SendSms
 */
export async function smsSend(params: SmsSend, env: Env) {
  const { phoneNumbers, signName, templateCode, templateParam } = params;
  const timestamp = new Date().toISOString().replace(/\.\d{3}/, "");

  const query = `AccessKeyId=${accessKeyId}&Action=SendSms&Format=JSON&PhoneNumbers=${smsUrlEncoder(
    phoneNumbers
  )}&SignName=${smsUrlEncoder(
    signName
  )}&SignatureMethod=HMAC-SHA1&SignatureNonce=${smsUrlEncoder(
    uuidv4()
  )}&SignatureVersion=1.0&TemplateCode=${templateCode}${
    templateParam ? `&TemplateParam=${smsUrlEncoder(templateParam)}` : ""
  }&Timestamp=${smsUrlEncoder(timestamp)}&Version=${smsVersion}`;
  const stringToSign = smsStringToSign({ method: "GET", queryString: query });
  const signature = smsSignature({ accessKeySecret, stringToSign });
  const url = `https://dysmsapi.aliyuncs.com/?${query}&Signature=${smsUrlEncoder(
    signature
  )}`;

  try {
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    return data as {
      Message: string;
      RequestId: string;
      BizId: string;
      Code: string;
    };
  } catch (e) {
    console.log(e);
    const error = {
      e,
      url,
      stringToSign,
      signature,
    };
    await env.KV.put(phoneNumbers + " " + timestamp, JSON.stringify(error));
    return null;
  }
}
