<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded-lg shadow w-80">
  
        <h2 class="text-xl font-bold mb-4 text-center">
          Login
        </h2>
  
        <form @submit.prevent="login">
  
          <!-- EMAIL -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="border p-2 w-full rounded"
            />
          </div>
  
          <p v-if="emailError" class="text-red-500 text-sm mb-2">
            {{ emailError }}
          </p>
  
          <!-- PASSWORD -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="border p-2 w-full rounded pr-10"
              />
  
              <!-- EYE ICON -->
              <button
                type="button"
                class="absolute inset-y-0 right-2 flex items-center"
                @click="togglePassword"
              >
  
              <!-- SHOW PASSWORD -->
              <EyeIcon
                v-if="showPassword"
                class="h-5 w-5 text-gray-500 cursor-pointer"
              />
  
              <!-- HIDE PASSWORD -->
              <EyeSlashIcon
                v-else
                class="h-5 w-5 text-gray-500 cursor-pointer"
              />
  
              </button>
            </div>
          </div>
          <p class="text-sm text-center mb-2">
            Don't have an account?
                <RouterLink to="/register" class="text-blue-500 underline">
                Sign Up
                </RouterLink>
          </p>
          
          <button
            type="submit"
            class="bg-blue-500 text-white w-full p-2 rounded"
          >
            Login
          </button>
  
        </form>
  
        <p v-if="error" class="text-red-500 text-sm mt-3">
          {{ error }}
        </p>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  
  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
    /\/$/,
    '',
  )

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  
  const emailError = ref('')
  const error = ref('')
  
  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }
  
  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.value)
  }
  
  const login = async () => {
  
    emailError.value = ''
    error.value = ''
  
    if (!validateEmail()) {
      emailError.value = 'Invalid email format'
      return
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        error.value = data.message || 'Login failed'
        return
      }
  
      localStorage.setItem('token', data.access_token)
  
      router.push('/dashboard')
  
    } catch (err) {
      error.value = err.message
    }
  }
  </script>