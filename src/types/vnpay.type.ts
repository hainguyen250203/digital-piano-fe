export type VerifyReturnUrlQuery = {
  vnp_Amount: string; // số tiền đã nhân 100
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: 'ATM' | 'INT' | string; // tùy loại thẻ
  vnp_OrderInfo: string;
  vnp_PayDate: string; // yyyyMMddHHmmss
  vnp_ResponseCode: string; // "00" là thành công
  vnp_TmnCode: string;
  vnp_TransactionNo: string; // Mã GD tại VNPAY
  vnp_TransactionStatus: string; // "00" = Thành công
  vnp_TxnRef: string; // Mã đơn hàng của bạn
  vnp_SecureHash: string; // Chữ ký VNPAY tạo
};

export type ReqReturnUrl = {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
};
