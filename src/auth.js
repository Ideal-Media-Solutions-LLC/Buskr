import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import React from 'react';

export const UserContext = React.createContext(null);

const {
  NEXT_PUBLIC_AWS_CLIENT: clientId,
  REGION: region,
  USER_POOL: userPoolId,
} = process.env;

const provider = new CognitoIdentityProviderClient({ region });

const getVerifier = function tokenUse(tokenUse) {
  return CognitoJwtVerifier.create({ userPoolId, clientId, tokenUse });
};

const idVerifier = getVerifier('id');
const accessVerifier = getVerifier('access');

export const verifyIdToken = async function verifyIdToken(payload) {
  return idVerifier.verify(payload);
};

export const verifyAccessToken = async function verifyAccessToken(payload) {
  return accessVerifier.verify(payload);
};

export const lookupAttributes = async function lookupAttributes(AccessToken) {
  const { UserAttributes } = await provider.send(new GetUserCommand({ AccessToken }));
  return Object.fromEntries(UserAttributes.map(({ Name, Value }) => [Name, Value]));
};
