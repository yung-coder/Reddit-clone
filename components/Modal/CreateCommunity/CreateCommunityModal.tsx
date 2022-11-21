import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { checkPrimeSync } from "crypto";
import React, { useState } from "react";
import { HiLockClosed } from "react-icons/hi";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { format } from "path";
import { auth, firestore } from "../../../src/firebase/Client";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { async } from "@firebase/util";
import useDirectory from "../../../src/hooks/useDirectory";
import { useRouter } from "next/router";

type CreateCommunityModalProps = {
  open: boolean;
  handelClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handelClose,
}) => {
  const [user] = useAuthState(auth);
  const [communityname, setcommunityname] = useState("");
  const [charsRemaning, setCharsremanig] = useState(21);
  const [communitytype, setcommunitytype] = useState("public");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const router = useRouter();
  const {toogleMenuOpen} = useDirectory();

  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setcommunityname(event.target.value);
    setCharsremanig(21 - event.target.value.length);
  };

  const onCommunitytypechange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setcommunitytype(event.target.name);
  };

  const handelCreateCommunity = async () => {
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityname) || communityname.length < 3) {
      seterror("Community name is not valid");
      return;
    }

    setloading(true);

    try {
      const coummunityDocref = doc(firestore, "communities", communityname);

      await runTransaction(firestore, async (transaction) => {
        const communitydoc = await transaction.get(coummunityDocref);

        if (communitydoc.exists()) {
          throw new Error("Name already taken");
          return;
        }

        transaction.set(coummunityDocref, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberofMembers: 1,
          privacyType: communitytype,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityname),
          {
            communityId: communityname,
            isModerator: true,
          }
        );
      });


      handelClose();
      toogleMenuOpen();
      router.push(`r/${communityname}`);
    } catch (error: any) {
      console.log("error", error);
      seterror(error.message);
    }

    setloading(false);
  };
  return (
    <>
      <Modal isOpen={open} onClose={handelClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.400">
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={communityname}
                size="sm"
                pl="22px"
                onChange={handelChange}
              />
              <Text
                color={charsRemaning === 0 ? "red" : "gray.500"}
                fontSize={9}
              >
                {charsRemaning} Characters remaning
              </Text>
              <Text fontSize="10pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>

                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communitytype === "public"}
                    onChange={onCommunitytypechange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize={8} color="gray.500">
                        Anyone can view post and comment
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="Restricted"
                    isChecked={communitytype === "Restricted"}
                    onChange={onCommunitytypechange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize={8} color="gray.500">
                        Anyone can view post and but only approved can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="Private"
                    isChecked={communitytype === "Private"}
                    onChange={onCommunitytypechange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize={8} color="gray.500">
                        Only Approved users can post
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalCloseButton />

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              onClick={handelClose}
              mr={3}
            >
              Close
            </Button>
            <Button
              height="30px"
              onClick={handelCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
