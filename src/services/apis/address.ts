import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { CreateAddressPayload, UpdateAddressPayload } from "@/types/address.type";


export const fetchGetAddressList = async () => {
  const { data } = await API.get(Endpoint().address.list);
  return data;
};

export const fetchGetAddressDetail = async (id: string) => {
  const { data } = await API.get(Endpoint().address.detail(id));
  return data;
};

export const fetchCreateAddress = async (payload: CreateAddressPayload) => {
  const { data } = await API.post(Endpoint().address.create, payload);
  return data;
};

export const fetchUpdateAddress = async (payload: UpdateAddressPayload) => {
  const { data } = await API.put(Endpoint().address.update(payload.id), payload);
  return data;
};

export const fetchDeleteAddress = async (id: string) => {
  const { data } = await API.delete(Endpoint().address.delete(id));
  return data;
};

export const fetchSetDefaultAddress = async (id: string) => {
  const { data } = await API.patch(Endpoint().address.setDefault(id));
  return data;
};



