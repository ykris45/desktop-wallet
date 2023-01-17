/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { fadeIn } from '@/animations'
import AddressEllipsed from '@/components/AddressEllipsed'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Truncate from '@/components/Truncate'
import { useGlobalContext } from '@/contexts/global'
import { useAppSelector } from '@/hooks/redux'
import ContactFormModal from '@/modals/ContactFormModal'
import SendModalTransfer from '@/modals/SendModals/SendModalTransfer'
import ContactStorage from '@/persistent-storage/contacts'
import { Contact } from '@/types/contacts'

import TabContent from './TabContent'

const ContactsTabContent = () => {
  const { t } = useTranslation()
  const { isPassphraseUsed } = useGlobalContext()
  const { mnemonic, name: walletName } = useAppSelector((state) => state.activeWallet)

  const contacts: Contact[] =
    mnemonic && walletName ? ContactStorage.load({ mnemonic, walletName }, isPassphraseUsed) : []

  const [storedContacts, setStoredContacts] = useState(contacts)
  const [filteredContacts, setFilteredContacts] = useState(contacts)
  const [searchInput, setSearchInput] = useState('')
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isContactFormModalOpen, setIsContactFormModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact>()

  if (!mnemonic || !walletName) return null

  const handleSearch = (searchInput: string) => {
    const input = searchInput.toLowerCase()

    setSearchInput(input)
    setFilteredContacts(filterContacts(storedContacts, input))
  }

  const openSendModal = (contact: Contact) => {
    setSelectedContact(contact)
    setIsSendModalOpen(true)
  }

  const closeSendModal = () => {
    setSelectedContact(undefined)
    setIsSendModalOpen(false)
  }

  const openEditContactModal = (contact: Contact) => {
    setSelectedContact(contact)
    setIsContactFormModalOpen(true)
  }

  const closeContactFormModal = () => {
    setSelectedContact(undefined)
    setIsContactFormModalOpen(false)
  }

  const refreshDisplayedContacts = () => {
    const storedContacts: Contact[] = ContactStorage.load({ mnemonic, walletName }, isPassphraseUsed)

    setStoredContacts(storedContacts)
    setFilteredContacts(filterContacts(storedContacts, searchInput))
  }

  return (
    <motion.div {...fadeIn}>
      <TabContent
        searchPlaceholder={t('Search for name or a hash...')}
        onSearch={handleSearch}
        buttonText={`+ ${t('New contact')}`}
        onButtonClick={() => setIsContactFormModalOpen(true)}
        newItemPlaceholderText={t('Create contacts to avoid mistakes when sending transactions!')}
      >
        {filteredContacts.map((contact) => (
          <Card key={contact.address}>
            <ContentRow>
              <Name>{contact.name}</Name>
              <AddressEllipsedStyled addressHash={contact.address} />
            </ContentRow>
            <ButtonsRow>
              <SendButton transparent borderless onClick={() => openSendModal(contact)}>
                <ArrowUp strokeWidth={1} />
                <ButtonText>{t('Send')}</ButtonText>
              </SendButton>
              <Separator />
              <EditButton transparent borderless onClick={() => openEditContactModal(contact)}>
                <Pencil strokeWidth={1} />
                <ButtonText>{t('Edit')}</ButtonText>
              </EditButton>
            </ButtonsRow>
          </Card>
        ))}
        <AnimatePresence>
          {isContactFormModalOpen && (
            <ContactFormModal
              contact={selectedContact}
              onClose={closeContactFormModal}
              onSave={refreshDisplayedContacts}
            />
          )}
          {isSendModalOpen && (
            <SendModalTransfer initialTxData={{ toAddress: selectedContact?.address }} onClose={closeSendModal} />
          )}
        </AnimatePresence>
      </TabContent>
    </motion.div>
  )
}

const filterContacts = (contacts: Contact[], text: string) =>
  text.length < 2
    ? contacts
    : contacts.filter(
        (contact) => contact.name.toLowerCase().includes(text) || contact.address.toLowerCase().includes(text)
      )

export default ContactsTabContent

const ContentRow = styled.div`
  padding: 60px 26px 30px;
  text-align: center;
`

const Name = styled(Truncate)`
  font-size: 18px;
  font-weight: var(--fontWeight-semiBold);
  margin-bottom: 20px;
`

const ButtonsRow = styled.div`
  display: flex;
`

const AddressEllipsedStyled = styled(AddressEllipsed)`
  font-size: 16px;
  font-weight: var(--fontWeight-medium);
`

const BottomButton = styled(Button)`
  border-top: 1px solid ${({ theme }) => theme.border.secondary};
  border-radius: 0;
  height: 85px;
  margin: 0;
  flex-direction: column;
`

const SendButton = styled(BottomButton)`
  border-bottom-left-radius: var(--radius-huge);
`
const EditButton = styled(BottomButton)`
  border-bottom-right-radius: var(--radius-huge);
`

const ButtonText = styled.div`
  font-size: 12px;
  margin-top: 10px;
`

const Separator = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.border.secondary};
`
