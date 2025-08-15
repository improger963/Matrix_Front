import React from 'react';
import type { Toast as ToastType } from '../../types.ts';
import Toast from './Toast.tsx';

interface ToastContainerProps {
    toasts: ToastType[];
    onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed top-20 right-4 z-[100] space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

export default ToastContainer;