import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../src/atoms/authModalAtom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../src/firebase/Client";
import { FIREBASE_ERRORS } from "../../../src/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { json } from "stream/consumers";
const Signup: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [SignupFrom, setSignupForm] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [formerr, setfromerr] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const onSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (SignupFrom.password !== SignupFrom.confirmpassword) {
      setfromerr("Password not matching");
      return;
    }
    createUserWithEmailAndPassword(SignupFrom.email, SignupFrom.password);
  };

  const onChangefrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocumnet = async (user: User) => {
    const userDocref = doc(firestore, "users", user.uid);
    await setDoc(userDocref, JSON.parse(JSON.stringify(user)));

    // const userDocref = doc(firestore, "users", user.uid);
    // await setDoc(userDocref, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (user) {
      createUserDocumnet(user.user);
    }
  }, [user]);

  return (
    <form onSubmit={onSumbit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChangefrom}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={onChangefrom}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="confirmpassword"
        placeholder="Confirm password"
        type="password"
        mb={2}
        onChange={onChangefrom}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      {(formerr || error) && (
        <Text textAlign="center" color="red" fontSize={15}>
          {formerr ||
            FIREBASE_ERRORS[error!.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Sign up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already redditor</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "Login",
            }))
          }
        >
          Login in
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
