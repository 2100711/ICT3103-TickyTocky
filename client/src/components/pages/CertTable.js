import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getAllCerts } from '../../api/certs';

export const CertTable = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [{
            title: 'Certificate ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'User Email',
            dataIndex: 'user_email',
            key: 'user_email',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, cert) => (
                <div>
                    <Button type="primary" onClick={() => handleViewPDF(cert)}>
                        View PDF
                    </Button>
                    <Button type="primary" onClick={() => handleDownloadPDF(cert)}>
                        Download PDF
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAllCerts();
                const data = response.certs;
                console.log("Data: ", data);
                setCerts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewPDF = (cert) => {
        // Access the pdf_content from the cert object
        console.log("fuck fsk s: ", cert);
        const pdfDataURL = `data:application/pdf;base64,${cert.pdf_content}`;
        window.open(pdfDataURL, '_blank');
    };

    const handleDownloadPDF = (cert) => {
        // Access the pdf_content from the cert object
        const pdfDataURL = `data:application/pdf;base64,${cert.pdf_content}`;
        const a = document.createElement('a');
        a.href = pdfDataURL;
        a.download = `${cert._id}.pdf`; // You can customize the filename here
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Table
            columns={columns}
            dataSource={certs}
            loading={loading}
            rowKey="_id"
            pagination={false}
        />
    );
};