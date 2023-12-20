import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const PublicRoute = () => {
  return (
    <main className='flex flex-1 flex-col max-w-full min-h-screen'>
        <Header />
        <Outlet />
        <Footer />
    </main>
  )
}

export default PublicRoute