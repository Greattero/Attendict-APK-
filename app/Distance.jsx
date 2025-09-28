import React from "react";

export default function Distance({ checkinLat, checkinLon, hostLat, hostLon, setDistance }) {

    React.useEffect(() => {
        if (checkinLat != null && checkinLon != null && hostLat != null && hostLon != null) {
            console.log(checkinLat);
            console.log(checkinLon);
            console.log(hostLat);
            console.log(hostLon)
            const R = 6371; // Earth radius in km
            const toRad = angle => angle * (Math.PI / 180);

            const dLat = toRad(checkinLat - hostLat);
            const dLon = toRad(checkinLon - hostLon);

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(hostLat)) * Math.cos(toRad(checkinLat)) *
                Math.sin(dLon / 2) ** 2;

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c;
            setDistance(distance);
            console.log(`distance: ${distance}`)
        }
    }, [checkinLat, checkinLon, hostLat, hostLon, setDistance]);

    return null;
}
