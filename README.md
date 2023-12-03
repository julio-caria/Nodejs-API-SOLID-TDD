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

