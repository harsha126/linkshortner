import 'antd/dist/reset.css';
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import { BaseURL } from '../constants';
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { saveTokeninLocalStorage } from '../utils';
import { ServerResponse } from './types';


const { Title } = Typography;

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values: { username: string, password: string }) => {
        try {
            setIsLoading(true);
            const res = await axios.post<ServerResponse<{ token: string }>>(BaseURL + '/user/login', values);
            message.success('Login successful!');
            saveTokeninLocalStorage(res.data.response.token);
            navigate('/home');
        } catch (err) {
            message.error('Login failed. Please check your credentials.');
            console.error(err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card} bordered={false} hoverable>
                <Title level={2} style={styles.title}>Login</Title>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    onChange={() => {
                        setError(false);
                    }}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                        validateStatus={error ? "error" : 'success'}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                        validateStatus={error ? "error" : 'success'}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={isLoading} disabled={isLoading}>
                            Login
                        </Button>
                    </Form.Item>
                    <div>
                        <Typography>do not have an account ? <Link href='/signup'>SignUp</Link></Typography>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 400,
        padding: '0px 30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        background: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
        color: '#1890ff',
    },
};

export default LoginPage;
