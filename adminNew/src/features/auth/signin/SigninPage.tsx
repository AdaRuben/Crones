import { loginUsers } from '@/entities/user/model/thunks';
import { useAppDispatch } from '@/shared/hooks';
import React from 'react';
import './SigninPage.css';

export default function SigninPage(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  const changeHandller = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void dispatch(loginUsers(form));
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={submitHandler}>
        <label>
          Ваш email
          <input type="email" name="email" onChange={changeHandller} value={form.email} />
        </label>
        <label>
          Ваш пароль
          <input type="password" name="password" onChange={changeHandller} value={form.password} />
        </label>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
