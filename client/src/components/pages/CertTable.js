import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Input, Popconfirm, message } from "antd";
import { getAllCerts, getCert, deleteCert } from "../../api/certs";

export const CertTable = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2);
    const [searchText, setSearchText] = useState("");
    const [originalCerts, setOriginalCerts] = useState([]);

    const columns = [{
            title: "Certificate ID",
            dataIndex: "cert_id",
            key: "cert_id",
            sorter: (a, b) => a.cert_id.localeCompare(b.cert_id),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "User Email",
            dataIndex: "user_email",
            key: "user_email",
            sorter: (a, b) => a.user_email.localeCompare(b.user_email),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text, cert) => (
                <div>
                    <Button type="primary" onClick={() => handleViewPDF(cert)}>
                        View PDF
                    </Button>
                    <Button type="primary" onClick={() => handleDownloadPDF(cert)}>
                        Download PDF
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this certificate?"
                        onConfirm={() => handleDeleteCert(cert.cert_id)}
                    >
                        <Button type="primary"danger>Delete</Button>
                    </Popconfirm>
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
                setCerts(data);
                setOriginalCerts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewPDF = async (cert) => {
        try {
            setLoading(true);
            const response = await getCert(cert.cert_id);
            const pdf = response.pdf_content;
            const pdfDataURL = `data:application/pdf;base64,${pdf}`;
            const newTab = window.open();
            newTab.document.title = `${cert.cert_id}`;
            newTab.document.write(
                '<iframe width="100%" height="100%" src="' + pdfDataURL + '"></iframe>'
            );
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDownloadPDF = (cert) => {
        const pdfDataURL = `data:application/pdf;base64,${cert.pdf_content}`;
        const a = document.createElement("a");
        a.href = pdfDataURL;
        a.download = `${cert.cert_id}.pdf`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDeleteCert = async (certId) => {
        try {
            setLoading(true);
            const deletedCert = { cert_id: certId };
            await deleteCert(deletedCert);
            message.success("Certificate deleted successfully");
            // After deletion, refresh the certificate list
            const response = await getAllCerts();
            const data = response.certs;
            setCerts(data);
            setOriginalCerts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            message.error("Failed to delete certificate");
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        filterCertificates(value);
    };

    const filterCertificates = (searchText) => {
        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase();
            const filteredCerts = originalCerts.filter((cert) => {
                const lowerCaseCertId = cert.cert_id.toLowerCase();
                const lowerCaseUserEmail = cert.user_email.toLowerCase();
                return (
                    lowerCaseCertId.includes(lowerCaseSearchText) ||
                    lowerCaseUserEmail.includes(lowerCaseSearchText)
                );
            });
            setCerts(filteredCerts);
        } else {
            setCerts(originalCerts);
        }
        setCurrentPage(1);
    };

    return (
        <div>
            <Input
                placeholder="Search by Certificate ID or User Email"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                columns={columns}
                dataSource={certs}
                loading={loading}
                rowKey="cert_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: certs.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: handlePageChange,
                }}
            />
        </div>
    );
};