import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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
import api from '../../services/api';
import sortByHour from '../../services/sortByHour';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  hour: string;
  user: {
    name: string;
    avatar: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) setSelectedDate(day);
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setSelectedMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: selectedMonth.getFullYear(),
          month: selectedMonth.getMonth() + 1,
        },
      })
      .then((response) => setMonthAvailability(response.data));
  }, [selectedMonth, user, setMonthAvailability]);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    api
      .get<Appointment[]>(`/appointments/me`, {
        params: { year, month, day },
      })
      .then((response) => {
        const appointmentsInDay = response.data
          .filter((appointment: Appointment) => {
            return parseISO(appointment.date).getDate() === day;
          })
          .map((appointment) => {
            return {
              ...appointment,
              hour: format(parseISO(appointment.date), 'HH:mm'),
            };
          });

        setAppointments(sortByHour(appointmentsInDay));
      });
  }, [selectedDate, user]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((date) => date.available === false)
      .map(({ day }) => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();

        return new Date(year, month, day);
      });

    return dates;
  }, [monthAvailability, selectedMonth]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() > 12;
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
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
            <span>{isToday(selectedDate) ? 'Hoje' : 'Outro'}</span>
            <span>{selectedDateAsText}</span>
            <span>{selectWeekDay}</span>
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

            {morningAppointments.map((appointment: Appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hour}
                </span>

                <div>
                  {appointment.user.avatar ? (
                    <img
                      src={appointment.user.avatar}
                      alt={appointment.user.name}
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.map((appointment: Appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hour}
                </span>

                <div>
                  {appointment.user.avatar ? (
                    <img
                      src={appointment.user.avatar}
                      alt={appointment.user.name}
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
