import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../src/atoms/authModalAtom";
import { auth } from "../../../src/firebase/Client";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
  const [modalstate, setmodalstate] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handelClose = () => {
    setmodalstate((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // const toggleView = (view: string) => {
  //   setmodalstate({
  //     ...modalstate,
  //     view: view as typeof modalstate.view,
  //   });
  // };

  useEffect(() => {
    if (user) {
      handelClose();
    }
  }, [user]);

  return (
    <>
      <Modal isOpen={modalstate.open} onClose={handelClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalstate.view === "Login" && "Login"}
            {modalstate.view === "signup" && "Signup"}
            {modalstate.view === "resetPassword" && "resetPassword"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex direction="column" align="center" justify="center">
              {modalstate.view === "Login" || modalstate.view == "signup" ? (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight={700}>
                    OR
                  </Text>
                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
