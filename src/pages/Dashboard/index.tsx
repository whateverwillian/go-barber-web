import React from 'react';

import { FiPower, FiClock } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  DefaultAvatar,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import { useAuth } from '../../hooks/authContext';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <DefaultAvatar />
            )}

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars2.githubusercontent.com/u/54903767?s=460&u=6d4d127794bd99d33a80f2318747cc18a9fc8689&v=4"
                alt="willian tavares"
              />

              <strong>Willian Tavares</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/54903767?s=460&u=6d4d127794bd99d33a80f2318747cc18a9fc8689&v=4"
                  alt="willian tavares"
                />
                <strong>Willian Tavares</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/54903767?s=460&u=6d4d127794bd99d33a80f2318747cc18a9fc8689&v=4"
                  alt="willian tavares"
                />

                <strong>Willian Tavares</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/54903767?s=460&u=6d4d127794bd99d33a80f2318747cc18a9fc8689&v=4"
                  alt="willian tavares"
                />
                <strong>Willian Tavares</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
