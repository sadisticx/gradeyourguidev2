import React from "react";
import { useParams } from "react-router-dom";
import FormResponse from "@/components/forms/FormResponse";

const FormResponsePage = () => {
  const { formId, sectionId } = useParams();

  return <FormResponse formId={formId} sectionId={sectionId} />;
};

export default FormResponsePage;
