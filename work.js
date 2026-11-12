const caseStudyCount = document.querySelectorAll(".case-study").length;
if (caseStudyCount !== 3) {
  throw new Error(`Expected three Stackly case studies; found ${caseStudyCount}.`);
}
