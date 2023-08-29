export type SmsCreateResponse = {
  error_code: number;
  reason: string;
  result: number | null;
};

export type SmsSendResponse = {
  reason: string;
  result: string;
  error_code: number;
};

export type SmsSend = {
  phoneNumbers: string;
  signName: string;
  templateCode: string;
  templateParam: string | null;
};
