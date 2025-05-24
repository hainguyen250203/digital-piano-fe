import Endpoint from '@/services/endpoint'
import API from '../axios'

export interface CreateSupplierData {
  name: string
  email: string
  phoneNumber: string
  address: string
  isDeleted?: boolean
}

export interface UpdateSupplierData {
  name?: string
  email?: string
  phoneNumber?: string
  address?: string
  isDeleted?: boolean
}

export interface SupplierResponse {
  id: string
  name: string
  email: string
  phone: string
  address: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export async function getSuppliers() {
  const response = await API.get(Endpoint().supplier.list)
  return response.data
}

export async function getSupplierById(id: string) {
  const response = await API.get(Endpoint().supplier.detail(id))
  return response.data
}

export async function createSupplier(data: CreateSupplierData) {
  const response = await API.post(Endpoint().supplier.create, data)
  return response.data
}

export async function updateSupplier(id: string, data: UpdateSupplierData) {
  const response = await API.patch(Endpoint().supplier.update(id), data)
  return response.data
}

export async function deleteSupplier(id: string) {
  const response = await API.delete(Endpoint().supplier.delete(id))
  return response.data
} 