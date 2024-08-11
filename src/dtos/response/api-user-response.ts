export type ApiUserResponse = {
  message: string;
  data: {
    user_id: string;
    account_number: string;
    full_name: string;
    email: string;
    balance: string;
  };
};
