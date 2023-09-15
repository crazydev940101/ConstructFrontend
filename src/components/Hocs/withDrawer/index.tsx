import React from 'react';

interface DrawerProps {
    drawerRef: React.RefObject<HTMLDivElement>;
    srcRoot: string;
}

// Higher-Order Component (HOC)
const withDrawer = (WrappedComponent: React.ComponentType<DrawerProps>) => {
    const WithDrawer = (props: DrawerProps) => {

        // Add your custom functionality here
        
        return <WrappedComponent {...props} />;
    };

    return WithDrawer;
};

export default withDrawer;