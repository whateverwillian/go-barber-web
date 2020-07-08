import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { FiLock } from 'react-icons/fi';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toastContext';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  passwordConfirm: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Digite a senha'),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação de senha incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace('?token=', '');

        if (!token)
          throw new Error('Um token é necessário para realizar essa ação');

        const { password, passwordConfirm } = data;

        await api.post('/password/reset', {
          password,
          passwordConfirm,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha redefinida com sucesso',
          description:
            'Sua senha foi redefinida com sucesso! Você já pode fazer logon na nossa aplicação',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar a senha, tente novamente',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="logo" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Resetar senha</h1>

            <Input
              icon={FiLock}
              name="password"
              placeholder="nova senha"
              type="password"
            />

            <Input
              icon={FiLock}
              name="passwordConfirm"
              placeholder="Confirme sua senha"
              type="password"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
