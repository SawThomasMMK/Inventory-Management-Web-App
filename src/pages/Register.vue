<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded-lg shadow w-80">
  
        <h2 class="text-xl font-bold mb-4 text-center">
          Sign Up
        </h2>
  
        <form @submit.prevent="register">
  
          <!-- NAME -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Full Name"
              class="border p-2 w-full rounded"
            />
          </div>
  
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

              <!-- TOGGLE PASSWORD VISIBILITY -->
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

          <!-- CONFIRM PASSWORD -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div class="relative">
              <input
                v-model="passwordConfirmation"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="Confirm Password"
                class="border p-2 w-full rounded pr-10"
              />

              <!-- TOGGLE CONFIRM PASSWORD VISIBILITY -->
              <button
                type="button"
                class="absolute inset-y-0 right-2 flex items-center"
                @click="togglePasswordConfirm"
              >
                <!-- SHOW CONFIRM PASSWORD -->
                <EyeIcon
                  v-if="showPasswordConfirm"
                  class="h-5 w-5 text-gray-500 cursor-pointer"
                />

                <!-- HIDE CONFIRM PASSWORD -->
                <EyeSlashIcon
                  v-else
                  class="h-5 w-5 text-gray-500 cursor-pointer"
                />
              </button>
            </div>
          </div>
  
          <button
            type="submit"
            class="bg-blue-500 text-white w-full p-2 rounded mt-2"
          >
            Register
          </button>
  
        </form>
  
        <!-- ERROR -->
        <p v-if="error" class="text-red-500 text-sm mt-3">
          {{ error }}
        </p>
  
        <!-- LINK TO LOGIN -->
        <p class="text-sm text-center mt-2">
          Already have an account?
          <button
            class="text-blue-500 underline"
            @click="router.push('/login')"
          >
            Login
          </button>
        </p>
  
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
 
const router = useRouter()
 
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const error = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const togglePasswordConfirm = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value
}

const register = async () => {

  error.value = ''

  try {

    const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || 'Registration failed'
      return
    }

    // store token
    localStorage.setItem('token', data.access_token)

    // go to dashboard
    router.push('/dashboard')

  } catch (err) {
    error.value = err.message
  }
}
</script>