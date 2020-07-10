import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, DefaultAvatar, AvatarInput } from './styles';
import { useAuth } from '../../hooks/authContext';
import { useToast } from '../../hooks/toastContext';
import api from '../../services/api';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirm: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Informe sua nova senha'),
            otherwise: Yup.string(),
          }),
          password_confirm: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Confirme sua senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirm } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirm,
              }
            : {}),
        };

        const response = await api.put('/profile/update', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description: 'Seus dados foram atualizados com sucesso',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }

        console.log(err);

        addToast({
          type: 'error',
          title: 'Erro ao atualizar',
          description: 'Houve um erro ao atualizar os dados, tente novamente',
        });
      }
    },
    [addToast, updateUser, history],
  );

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const data = new FormData();
      data.append('avatar', event.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        addToast({
          type: 'success',
          title: 'Avatar atualizado',
        });

        updateUser(response.data);
      });
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <DefaultAvatar />
            )}

            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            name="old_password"
            placeholder="Senha antiga"
            type="password"
          />

          <Input
            icon={FiLock}
            name="password"
            placeholder="Nova senha"
            type="password"
          />

          <Input
            icon={FiLock}
            name="password_confirm"
            placeholder="Confirmar senha"
            type="password"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
