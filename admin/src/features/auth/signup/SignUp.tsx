import { registerUser } from '@/entities/user/model/thunks';
import { useAppDispatch } from '@/shared/hooks';
import React from 'react'

export default function SignUp (): React.JSX.Element {

    const dispatch = useAppDispatch();

    const [form , setForm] = React.useState({
        name: '',
        email: '',
        password: '',
    })

    const changeHandller = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form,[e.target.name]: e.target.value
        })
    }

    const submitHandler =  (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
         void dispatch(registerUser(form));
    }

  return (
    <div>   
        <h2>SignUp</h2>
        <form onSubmit={submitHandler}>
        <label>
          Ваше имя
          <input type='text' name='name' onChange={changeHandller} value={form.name} />
        </label>
        <label>
          Ваш email
          <input type='email' name='email' onChange={changeHandller} value={form.email} />
        </label>
        <label>
          Ваш пароль
          <input type='password' name='password' onChange={changeHandller} value={form.password} />
        </label>
        <button type='submit'>Зарегистрироваться</button>
      </form>
    </div>
  )
}
