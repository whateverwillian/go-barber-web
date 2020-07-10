import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
    if (modifiers.available && !modifiers.disabled) setSelectedDate(day);
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

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.date), new Date()),
    );
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
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
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

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar}
                  alt={nextAppointment.user.name}
                />

                <strong>Willian Tavares</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Não há agendamentos nesse período</p>
            )}

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

            {afternoonAppointments.length === 0 && (
              <p>Não há agendamentos nesse período</p>
            )}

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
