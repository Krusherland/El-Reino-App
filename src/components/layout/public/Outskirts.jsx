import React from 'react'
import { Outlet } from 'react-router-dom'
import { UnifiedHeader } from '../shared/UnifiedHeader'
import { useAuth } from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const Outskirts = () => {
  const { auth } = useAuth();
  return (
    <>
      <UnifiedHeader isPrivate={false} />
      <section>
        {!auth._id ? <Outlet /> : <Navigate to="/kingdom/palace" />}
      </section>
    </>
  )
}
