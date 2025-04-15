"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { socketService } from "@/services/socket-service";
import { useEffect } from "react";

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const auth = useAppSelector((state) => state.auth);

	useEffect(() => {
		// Socket bağlantısını kullanıcı kimlik doğrulaması yapıldığında başlat
		if (auth.user && auth.token) {
			socketService.init(auth);
		}

		// Component unmount olduğunda bağlantıyı kapat
		return () => {
			socketService.disconnect();
		};
	}, [auth]);

	// Provider sadece socket bağlantısını yönetiyor, UI render etmiyor
	return <>{children}</>;
}
