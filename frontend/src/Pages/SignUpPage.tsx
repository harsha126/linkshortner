import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import { BaseURL } from '../constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const SignUpPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values: { username: string, password: string, name: string, email: string }) => {
        console.log(values);
        try {
            setIsLoading(true);
            const res = await axios.post(BaseURL + '/user/signup', values);
            message.success('Sign up successful!');
            console.log(res.data);
            navigate('/home')
        }
        catch (err) {
            message.error('Sign failed.');
            console.error(err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card} bordered={false} hoverable>
                <Title level={2} style={styles.title}>Sign Up</Title>
                <Form
                    name="signup_form"
                    initialValues={{}}
                    onFinish={onFinish}
                    layout="vertical"
                    onChange={() => setError(false)}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                        validateStatus={error ? "error" : 'success'}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Full Name" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                        validateStatus={error ? "error" : 'success'}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid Email!' },
                        ]}
                        validateStatus={error ? "error" : 'success'}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
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
                        <Button type="primary" htmlType="submit" size="large" block style={styles.button} loading={isLoading} disabled={isLoading}>
                            Sign Up
                        </Button>
                    </Form.Item>
                    <div>
                        <Typography>Already have an account ? <Link href='/login'>Login</Link></Typography>
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
        width: 450,
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
    button: {
        marginTop: 24,
    }
};

export default SignUpPage;
