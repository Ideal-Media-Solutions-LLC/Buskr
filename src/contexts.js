import React from 'react';

/** @type {React.Context<{ lng: number, lat: number }>} */
export const LocationContext = React.createContext();

/** @type {React.Context<{ id: string, email: string, name: string, picture?: string }>} */
export const UserContext = React.createContext();
