import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useAuth } from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';


export const Outskirts = () => {
  const { auth } = useAuth();
  return (
    <>
    <Header />
    <section>
      {!auth._id ? <Outlet /> : <Navigate to="/kingdom/palace" />}
    </section>
    </>
  )
}
