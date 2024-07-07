import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Img,
  Tooltip,
  HStack,
  Spacer,
  Button,
  ModalProps,
  ModalContentProps,
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';
import styles from '../styles/FeedbackModal.module.css';

export type ModalActionButtonProps = {
  text: string;
  action: () => void;
  iconSrc?: string;
  tooltipText?: string;
  loading?: boolean;
  isDisabled?: boolean;
};

interface ModContainerProps extends ModalContentProps {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  footerText?: string;
  actionButtonProps?: ModalActionButtonProps | undefined;
  hasCancelButton?: boolean;
  hideButtons?: boolean;
}

export const ModalContainer = ({
  onClose,
  isOpen,
  title,
  footerText,
  children,
  actionButtonProps,
  hasCancelButton,
  hideButtons = false,
  ...props
}: ModContainerProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        {...props}
        maxW="385px"
        bgColor="#8542eb"
        border="10px solid white"
        color={'white'}
        fontSize="16px"
        fontWeight="600"
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
          <Spacer h="32px" />
          <HStack hidden={hideButtons} justifyContent="center">
            {actionButtonProps ? (
              <>
                <Button
                  variant={'solidLight'}
                  leftIcon={
                    actionButtonProps.iconSrc ? (
                      <Img
                        className={styles.customButtonImg}
                        src={actionButtonProps.iconSrc}
                      />
                    ) : undefined
                  }
                  onClick={actionButtonProps.action}
                  isLoading={actionButtonProps.loading}
                  isDisabled={
                    actionButtonProps.loading || actionButtonProps.isDisabled
                  }
                  rightIcon={
                    actionButtonProps.tooltipText ? (
                      <Tooltip label={actionButtonProps.tooltipText}>
                        <InfoIcon />
                      </Tooltip>
                    ) : undefined
                  }
                  //w="165px"
                >
                  {actionButtonProps.text}
                </Button>
                {hasCancelButton && (
                  <Button
                    onClick={onClose}
                    variant={'outlinedStake'}
                    className={styles.cancelButton}
                  >
                    {'CANCEL'}
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant={'outlinedStake'}
                onClick={onClose}
                className={styles.closeButton}
              >
                {'CLOSE'}
              </Button>
            )}
          </HStack>
        </ModalBody>
        {footerText && <ModalFooter>{footerText}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
