import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toastContext';
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('Email é obrigatório')
            .email('Digit um email válido'),
          password: Yup.string().min(
            8,
            'A senha precisa ter no mínimo 8 dígitos',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, password, passwordConfirm } = data;

        await api.post('/users', {
          name,
          email,
          password,
          passwordConfirm,
        });

        addToast({
          type: 'success',
          title: 'Conta registrada!',
          description:
            'Sua conta foi registrada com sucesso, você agora pode fazer login',
        });

        history.push('/');
      } catch (err) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Erro ao criar conta',
          description: 'Houve um erro ao registrar conta, tente novamente',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input icon={FiUser} name="name" placeholder="nome" />
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              placeholder="senha"
              type="password"
            />

            <Input
              icon={FiLock}
              name="passwordConfirm"
              placeholder="confirmar senha"
              type="password"
            />
            <Button type="submit">Entrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para Login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
