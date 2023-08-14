import { SmsCreateResponse, SmsSendResponse } from "../models/SmsModel";

const baseUrl = "https://smsv2.market.alicloudapi.com/sms";
const appCode = "b567b7be3fe7490c853ef2b222623294";

/**
 * Send a message to the given mobile number
 * @param params {content: string, mobile: string}
 * @returns {Promise<null|Response>}
 * @seeMore https://market.aliyun.com/products/57000002/cmapi00046952.html
 */
export async function smsSend(params: { content: string; mobile: string }) {
  const request = {
    method: "GET",
    headers: {
      Authorization: `APPCODE ${appCode}`,
    },
  };

  // Remove the country code
  params.mobile = params.mobile.replace("+86", "");

  const url = new URL(baseUrl + "/sendv2");
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url, request);
    const data = await response.json();
    return data as SmsSendResponse;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function smsCreateTemplate(params: {
  content: string;
  signature: string;
}) {
  const request = {
    method: "POST",
    headers: {
      Authorization: `APPCODE ${appCode}`,
    },
    body: JSON.stringify(params),
  };

  try {
    const response = await fetch(baseUrl + "/edittemplete", request);
    const data = await response.json();
    return data as SmsCreateResponse;
  } catch (e) {
    console.log(e);
    return null;
  }
}
