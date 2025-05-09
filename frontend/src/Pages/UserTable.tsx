import React from 'react';
import { Table, Tag } from 'antd';
import { LinkDTO } from './HomePage';



interface UsersTableProps {
    allLinks: LinkDTO[];
}

const UsersTable: React.FC<UsersTableProps> = ({ allLinks }) => {
    const protocol = window.location.protocol;
    const frontEndUrl = window.location.host;
    console.log('renderes', allLinks)

    const columns = [
        {
            title: 'Original Url',
            dataIndex: 'originalUrl',
        },
        {
            title: 'generatedUrl',
            dataIndex: 'generatedHash',
            render: (shortUrl: string) => (
                `${protocol}//${frontEndUrl}/${shortUrl}`
            ),
        },
        {
            title: 'Hits',
            dataIndex: 'hits',
            render: (role: string) => (
                <Tag color='geekblue' key={role}>
                    {role}
                </Tag>
            ),
        },
    ];

    return (
        <div style={styles.container}>
            <Table columns={columns} dataSource={allLinks} pagination={{ pageSize: 5 }} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        margin: '24px auto',
        width: '100%',
        maxWidth: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
};

export default UsersTable;
