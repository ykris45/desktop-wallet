import React from 'react'
import styled from 'styled-components'

import { ReactComponent as TreesSVG } from '../images/trees.svg'
import { ReactComponent as MountainSVG } from '../images/mountain.svg'
import { motion } from 'framer-motion'
import { Input } from '../components/Inputs'
import { Button } from '../components/Buttons'
import tinycolor from 'tinycolor2'
import { PageContainer, ContentContainer, PageTitle, SectionContent } from '../components/PageComponents'
import { useHistory } from 'react-router'

interface HomeProps {
  hasWallet: boolean
}

const Home = ({ hasWallet }: HomeProps) => (
  <PageContainer>
    <Header>
      <ContentContainer>
        <HeaderText>
          <PageTitle color="contrast">{hasWallet ? 'Welcome back!' : 'Hi there!'}</PageTitle>
          <h3>Welcome to the Alephium Wallet!</h3>
          <p>Use the smart money of the future while keeping your mind at ease.</p>
        </HeaderText>
        <Moon initial={{ bottom: '-2vh' }} animate={{ bottom: '10vh' }} transition={{ delay: 0.2, duration: 1.2 }} />
        <CloudGroup
          coordinates={[
            ['10px', '0px'],
            ['0px', '15px'],
            ['15px', '30px']
          ]}
          lengths={['30px', '20px', '25px']}
          style={{ bottom: '2vh' }}
          distance="10px"
          side="left"
        />
        <CloudGroup
          coordinates={[
            ['10px', '0px'],
            ['20px', '15px'],
            ['55px', '30px']
          ]}
          lengths={['30px', '40px', '25px']}
          style={{ top: '3vh' }}
          distance="20px"
          side="right"
        />
        <MountainImage />
      </ContentContainer>
    </Header>
    <InteractionArea>
      <ContentContainer>
        {hasWallet ? <Login /> : <InitialActions />}
        <TreesImage />
      </ContentContainer>
    </InteractionArea>
  </PageContainer>
)

// === Components

const Login = () => (
  <SectionContent>
    <Input placeholder="Username" />
    <Input placeholder="Password" />
    <Button>Login</Button>
  </SectionContent>
)

const InitialActions = () => {
  const history = useHistory()

  const handleClick = () => {
    history.push('/create')
  }

  return (
    <SectionContent style={{ marginTop: '8vh' }}>
      <Button onClick={handleClick}>New wallet</Button>
      <Button>Import wallet</Button>
    </SectionContent>
  )
}

// === Styling

const Header = styled.header`
  flex: 1;
  background-color: ${({ theme }) => theme.bg.contrast};
  position: relative;
  overflow: hidden;
`

const InteractionArea = styled.div`
  flex: 0.8;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const HeaderText = styled.div`
  margin-top: 7vh;
  max-width: 700px;
  color: ${({ theme }) => theme.font.contrast};
`

const Moon = styled(motion.div)`
  position: absolute;
  right: 6vw;
  height: 15vw;
  width: 15vw;
  max-height: 80px;
  max-width: 80px;
  border-radius: 200px;
  background-color: ${({ theme }) => theme.global.accent};
`

const MountainImage = styled(MountainSVG)`
  position: absolute;
  width: 100%;
  height: 40%;
  bottom: -2px;
`

const TreesImage = styled(TreesSVG)`
  position: absolute;
  bottom: 3vh;
  left: 5vw;
  width: 50vw;
  height: 100px;
  max-width: 300px;
  z-index: -1;

  path {
    stroke: ${({ theme }) => theme.font.primary};
    stroke-width: 3px;
  }
`

const CloudGroup = ({
  coordinates,
  lengths,
  side,
  distance,
  style
}: {
  coordinates: [string, string][]
  lengths: string[]
  side: 'right' | 'left'
  distance: string
  style?: React.CSSProperties | undefined
}) => {
  const clouds = []

  for (let i = 0; i < coordinates.length; i++) {
    clouds.push(<Cloud key={i} style={{ left: coordinates[i][0], top: coordinates[i][1], width: lengths[i] }} />)
  }

  return (
    <StyledCloudGroup
      initial={{ [side]: '-100px' }}
      animate={{ [side]: distance }}
      transition={{ delay: 0.1, duration: 0.5 }}
      style={style}
    >
      {clouds}
    </StyledCloudGroup>
  )
}

const StyledCloudGroup = styled(motion.div)`
  height: 50px;
  width: 100px;
  position: absolute;
`

const Cloud = styled.div`
  position: absolute;
  background-color: ${({ theme }) => tinycolor(theme.bg.primary).setAlpha(0.9).toString()};
  height: 3px;
`

export default Home
