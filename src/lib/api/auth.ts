import type { AuthSession } from "@/lib/auth"
import { apiRequest } from "./client"

export interface LoginRequest {
  email: string
  password: string
}

export async function login(request: LoginRequest): Promise<AuthSession> {
  const res = await apiRequest<AuthSession>("/api/auth/login", "login", {
    method: "POST",
    body: request,
    isPublic: true,
  })
  if (!res.data?.token || !res.data.expiredAt) throw new Error("Response login tidak valid")
  return res.data
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface OtpSentResponse {
  email: string
  expiresInSeconds: number
  resendAvailableInSeconds: number
}

export async function signUp(request: SignUpRequest): Promise<OtpSentResponse> {
  const res = await apiRequest<OtpSentResponse>("/api/auth/sign-up", "sign up", {
    method: "POST",
    body: request,
    isPublic: true,
  })
  if (!res.data?.email) throw new Error("Response sign up tidak valid")
  return res.data
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface RegisteredUser {
  firstName: string
  lastName: string
  email: string
}

export async function verifySignUpOtp(request: VerifyOtpRequest): Promise<RegisteredUser> {
  const res = await apiRequest<RegisteredUser>("/api/auth/sign-up/verify", "verifikasi OTP", {
    method: "POST",
    body: request,
    isPublic: true,
  })
  if (!res.data?.email) throw new Error("Response verifikasi OTP tidak valid")
  return res.data
}

export async function resendSignUpOtp(email: string): Promise<OtpSentResponse> {
  const res = await apiRequest<OtpSentResponse>("/api/auth/sign-up/resend", "kirim ulang OTP", {
    method: "POST",
    body: { email },
    isPublic: true,
  })
  if (!res.data?.email) throw new Error("Response kirim ulang OTP tidak valid")
  return res.data
}
