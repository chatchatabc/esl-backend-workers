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

  console.log(url.toString());

  try {
    const response = await fetch(url, request);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
