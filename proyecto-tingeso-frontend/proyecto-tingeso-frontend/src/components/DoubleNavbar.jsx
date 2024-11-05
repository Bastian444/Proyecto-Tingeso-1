import React from 'react';
import ClientNavbar from './ClientNavbar';
import StaffNavbar from './StaffNavbar';

function DoubleNavbar() {
    return (
        <div>
            <ClientNavbar />
            <StaffNavbar />
        </div>
    );
}

export default DoubleNavbar;
