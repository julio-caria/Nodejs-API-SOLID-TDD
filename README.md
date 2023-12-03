# API com NodeJS + SOLID + TDD

## Iniciando o projeto

- Instalação do ESLint: 

```bash
npm init
npm init @eslint/config
```

Configure o ESLint com as seguintes respostas:

> Style -> ESM -> None -> Yes -> Node -> guide -> standard-with-typescript -> JSON

Dentro de nosso arquivo .eslintrc.json, aplique as seguintes linhas de código:

```JSON
{
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": "standard-with-typescript",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-useless-constructor": "off"
    }
}
```

## Desacoplamento

É importante, antes de estruturar nosso projeto, pensarmos em desacoplamento, ou seja, pensar como um projeto independente das pontas. Ou seja, independente do framework que será utilizado, do banco de dados etc.

Outra coisa muito comum entre os desenvolvedores back-end ao começar a desenvolver uma API, é pensar na estrutura das entidades e em como serão armazenadas, porém não necessariamente uma entidade à nível de banco é a melhor forma de tratar quando formos estruturar a entidade à nível de código.

## Domain

Geralmente, antes de começarmos estruturando nosso banco de dados à nível de código, devemos conversar com quem tem domínio a respeito do propósito ao qual o software irá atender, nessa conversa serão apresentadas todas as entidades que estarão presentes no banco de dados.

Por exemplo, considere a seguinte situação:

```txt
  Os meus CLIENTES, preciam realizar AGENDAMENTOS só que eles não conseguem saber os HORÁRIOS disponíveis que eu tenho.
```

## Interface

Uma maneira alternativa de se criar classes que tenham metodos acessores é através da utilização de interfaces, como o código abaixo: 

```typescript
export interface AppointmentProps {
  customer: string;
  startsAt: Date;
  endsAt: Date;
}

export class Appointment {
  private props: AppointmentProps

  get customer() {
    return this.props.customer
  }
  get startsAt() {
    return this.props.startsAt
  }
  get endsAt() {
    return this.props.endsAt
  }

  constructor(props: AppointmentProps) {
    this.props = props
  }
}
```

Nessa etapa, já conseguimos realizar a construção de um teste, para isso podemos adicionar um arquivo com extensão `.spec.ts` ou `.test.ts`.
Dependendo de gosto e arquitetura, podemos estruturar nosso projeto com os arquivos de test próximos ao arquivo de implementação (no mesmo diretório) ou adicionar um novo diretório como `src/test/arquivo.spec.ts`.

## Iniciando com testes

O node, a partir da versão v0.18.0 possui suporte nativo à testes. Porém na aula não foi utilizado essa ferramenta e sim o vitest, este possui suporte ao ESM, TypeScript e JSX.

Para realizar sua instalação, basta executar o seguinte comando no CLI:

```bash
npm i vitest -D
```

Agora, você precisará criar um arquivo com o nome `vite.config.ts`, nele aplicar as configurações.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {}
})
```

Já em nosso arquivo `appointment.spec.ts`, podemos aplicar as funções para testes, sendo elas: 

```ts
import { Appointment } from './appointment';
import { expect, test } from 'vitest'

test('create an appointment', () => {
  const startsAt = new Date();
  const endsAt = new Date();

  endsAt.setDate(endsAt.getDate() + 1)

  const appointment = new Appointment({
    customer: 'John Doe',
    startsAt,
    endsAt,
  })

  expect(appointment).toBeInstanceOf(Appointment)
  expect(appointment.customer).toEqual('John Doe')
})

test('cannot create an appointment with end date before start date', () => {
  const startsAt = new Date();
  const endsAt = new Date();

  endsAt.setDate(endsAt.getDate() - 1)

  expect(() => {
    return new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt,
    })
  }).toThrow()
})
```

- `test():` Indica a intenção teste, o primeiro parâmetro é o intuito definido para a criação daquele teste, já o segundo uma arrow function, executada localmente, onde é passado bloco de código para execução.
- `expect()`: Essa função contém o que é esperado com aquele teste, o que deve ser retornado.

## Casos de uso

Crie uma pasta com o nome de `use-cases`, vale lembrar que esse nome em questão, trata-se de uma seleção pessoal.

O arquivo de caso de uso pode armazenar uma classe ou um método (Função).

Todo caso de uso possui, apenas, uma única funcionalidade, uma entrada e uma saída (Request e Response).

Arquivo `create-appointment.ts`

```ts
import { Appointment } from './../entities/appointment';

interface CreateAppointmentRequest {
  customer: string,
  startsAt: Date,
  endsAt: Date,
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
  async execute({ customer, startsAt, endsAt }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const appointment = new Appointment({
      customer, 
      startsAt,
      endsAt,
    })

    return appointment
  }  
}
```

Arquivo `create-appointment.spec.ts`:

```ts
import { describe, expect, it } from "vitest"
import { CreateAppointment } from "./create-appointment"
import { Appointment } from "../entities/appointment"

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const createAppointment = new CreateAppointment()
    // SUT => System under Test

    const startsAt = new Date()
    const endsAt = new Date()

    endsAt.setDate(endsAt.getDate() + 1)

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })
})
```

## Regras de negócio

As regras de negócio podem ser validadas em dois momentos: nos casos de uso ou nas entidades.

Para saber se uma regra de negócio deve ser aplicada nas entidades ou nos casos de uso, deve-se pensar em:

1. É necessário saber informações apenas daquela entidade (Se sim, a regra é aplicada na entidade).
2. Se for necesário saber informações de várias entidades, a regra de negócio deverá ser aplicada em nosso caso de uso.
