"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode, useEffect, useState } from "react";

interface ClientAuthProviderProps {
	children: ReactNode,
	domain: string
	clientId: string
}

const ClientAuthProvider = ({ domain, clientId, children }: ClientAuthProviderProps) => {
	const [redirectUri, setRedirectUri] = useState<string>("");

	// Set the redirect URI on the client side
	useEffect(() => {
		if (typeof window !== "undefined") {
			setRedirectUri(window.location.origin);
		}
	}, []);

	// Render only after the redirectUri is set (ensuring it runs on the client)
	if (!redirectUri) return null;

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				redirect_uri: redirectUri
			}}
			cacheLocation="localstorage" // Ensures state is stored in local storage for persistence
		>
			{children}
		</Auth0Provider>
	);
};

export default ClientAuthProvider;
