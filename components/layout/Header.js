import React, {useContext} from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core';
import Search from '../ui/Search'
import Navigation from './Navigation'
import Link from 'next/link'
import Button from '../ui/Button'
import {FirebaseContext} from '../../firebase'

const ContainerHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--orange);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;
const Headercss = styled.header`
    border-bottom: 2px solid var(--grey3);
    padding: 2rem 0;
`;

const Searchcss = styled.div`
    display: flex;
    align-items: center;
`;

const Buttons = styled.div`
    display: flex;
    align-items: center;
`

const Header = () => {

    const { user, firebase } = useContext(FirebaseContext)

    return (
        <Headercss>
            <ContainerHeader>
                <Searchcss>
                    <Link href='/'>
                        <Logo>P</Logo>
                    </Link>
                    <Search />
                    <Navigation />
                </Searchcss>
                <Buttons>
                {user? (
                    <>
                        <p
                        css={css`
                            margin-right: 2rem;
                            `}
                        >Hola: {user.displayName} </p>
                        <Button 
                            bgColor='true'
                            onClick={()=> firebase.logout()}
                        >Cerrar sesión</Button>
                    </>
                ):(
                    <>
                        <Link href='/login'>
                            <Button
                                bgColor='true'
                            >Login</Button>
                        </Link>
                        <Link href='/signup'>
                            <Button>Crear cuenta</Button>
                        </Link>
                    </>
                )}
                </Buttons>
            </ContainerHeader>
        </Headercss>
    );
};

export default Header;