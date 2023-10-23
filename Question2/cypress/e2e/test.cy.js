import data from "../../submissionData.json"; // do not create this file

//let data = [{ submission_link: "http://127.0.0.1:5500/", id: 67890 }];

import "cypress-real-events";

data.forEach((ele) => {
  describe("Test test cases for card-list",{retries:3}, () => {
    let url = ele.submission_link;
    let acc_score = 1;
    if (url && url.trim().length) {
      it("should flip the card when hovered", () => {
        cy.visit(url);
        cy.get(".card-front").should("be.visible");
        cy.get(".card-back").should("not.be.visible");
        cy.get(".card-inner")
          .realHover({ force: true })
          .then(() => {
            cy.wait(100).then(() => {
              cy.get(".card-front").should("not.be.visible");
              cy.get(".card-back").should("be.visible");
              cy.get(".card-inner")
                .should("have.css", "transform")
                .and("match", /matrix3d\(.*\)/);
              cy.get(".problem_name")
                .realHover()
                .then(() => {
                  cy.get(".card-front").should("be.visible");
                  cy.get(".card-back").should("not.be.visible");
                });
            });
          });
        cy.then(() => {
          acc_score += 2;
        });
      });
      it("Should move button away on hover",{retries:3}, () => {
        cy.visit(url);
        cy.get("a").click({force:true}).then(()=>{
          cy.wait(1000).then(()=>{
            cy.get(".move-button").then(($button) => {
              const initialPosition = $button[0].getBoundingClientRect();
              cy.get(".move-button")
                .realHover({ force: true })
                .then(() => {
                  const secondPosition = $button[0].getBoundingClientRect();
                  expect(initialPosition.left).to.equal(secondPosition.left);
                  expect(initialPosition.right).to.equal(secondPosition.right);
                })
                .then(() => {
                  cy.wait(1200).then(() => {
                    cy.get(".move-button").then(($buttonAfterHover) => {
                      const positionAfterHover =
                        $buttonAfterHover[0].getBoundingClientRect();
                      console.log({ initialPosition, positionAfterHover });
                      expect(positionAfterHover.top).not.to.equal(
                        initialPosition.top
                      );
                      expect(positionAfterHover.left).not.to.equal(
                        initialPosition.left
                      );
                    });
                  });
                });
            });
          })
        })
        cy.then(() => {
          acc_score += 2;
        });
      });
    }
    it(`generate score`, () => {
      //////////////
      console.log(acc_score);
      let result = {
        id: ele.id,
        marks: Math.floor(acc_score),
      };
      result = JSON.stringify(result);
      cy.writeFile("results.json", `\n${result},`, { flag: "a+" }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  });
});
