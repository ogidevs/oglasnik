import React from 'react';
import { CgSpinner } from 'react-icons/cg';

const Spinner = () => (
    <div className="flex justify-center items-center h-full py-10">
        <CgSpinner className="animate-spin text-indigo-600 h-12 w-12" />
    </div>
);

export default Spinner;