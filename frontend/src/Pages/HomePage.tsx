import React, { useEffect, useState } from 'react';
import { Input, Button, Typography, message, Card, Space, Form } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import UsersTable from './UserTable';
import axiosInstance from '../utils';
import { ServerResponse } from './types';
import { BaseURL } from '../constants';

export type LinkDTO = {
    originalUrl: string;
    generatedHash: string;
    createdAt: Date;
    hits: number;
    userId: string;
    isExpired: boolean;
    expirationDate: Date | null;
};

const HomePage = () => {
    const { Title, Text } = Typography;
    const accessToken = localStorage.getItem('accessToken');
    const [form] = Form.useForm();
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const protocol = window.location.protocol;
    const frontEndUrl = window.location.host;
    const [allLinks, setAllLinks] = useState<LinkDTO[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get<ServerResponse<{ links: LinkDTO[] }>>(BaseURL + '/link/all')
                setAllLinks(res.data.response.links);
            } catch (err) {
                console.error(err)
            }
        }
        if (accessToken) {
            fetchData()
        }
    }, [accessToken])
    const handleShorten = async (values: { url: string }) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post<ServerResponse<LinkDTO>>('/link', {
                link: values.url,
            });
            setShortUrl(response.data.response.generatedHash);
            setAllLinks((prev) => {
                return [response.data.response, ...prev]
            })
            message.success('URL shortened successfully!');
        } catch {
            message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${protocol}//${frontEndUrl}/${shortUrl}`);
        message.success('Copied to clipboard!');
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card} variant="borderless">
                <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
                    URL Shortener
                </Title>

                <Form form={form} onFinish={handleShorten} layout="vertical">
                    <Form.Item
                        name="url"
                        rules={[
                            { required: true, message: 'Please enter a URL' },
                            {
                                pattern: /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/,
                                message: 'Please enter a valid URL starting with http:// or https://',
                            },
                        ]}
                    >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Enter your URL"
                                size="large"
                                prefix={<LinkOutlined />}
                            />
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                            >
                                Shorten
                            </Button>
                        </Space.Compact>
                    </Form.Item>
                </Form>

                {shortUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={styles.resultBox}
                    >
                        <Text strong>Short URL:</Text>
                        <Space style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                            <Text>{`${protocol}//${frontEndUrl}/${shortUrl}`}</Text>
                            <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                                Copy
                            </Button>
                        </Space>
                    </motion.div>
                )}
            </Card>
            <UsersTable allLinks={allLinks} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        flexDirection: 'column',
    },
    card: {
        width: '100%',
        maxWidth: 500,
        padding: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 12,
        background: '#fff',
    },
    resultBox: {
        marginTop: 24,
        padding: '16px',
        background: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
    },
};

export default HomePage;
