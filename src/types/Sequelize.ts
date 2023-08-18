export type user = {
  id?: number;
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  phone: string;
  website?: string;
  facebook?: string;
};

export type history = {
  id?: number;
  media: string;
  peoples: number;
  views: number;
  amount: number;
};
