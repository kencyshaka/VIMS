/*
 * Copyright © 2013 VillageReach.  All Rights Reserved.  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 *
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package org.openlmis.pageobjects;


import org.openlmis.UiUtils.TestWebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.pagefactory.AjaxElementLocatorFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertFalse;
import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;
import static com.thoughtworks.selenium.SeleneseTestNgHelper.assertEquals;
import static org.openqa.selenium.support.How.ID;
import static org.openqa.selenium.support.How.XPATH;


public class ConfigureOrderPage extends RequisitionPage {

  @FindBy(how = ID, using = "orderFilePrefix")
  private static WebElement orderFilePrefix;

  @FindBy(how = ID, using = "includeHeadersCheckbox")
  private static WebElement includeOrderHeaders;

  @FindBy(how = ID, using = "includeCheckbox0")
  private static WebElement orderNumberCheckBox;

  @FindBy(how = ID, using = "includeCheckbox1")
  private static WebElement facilityCodeCheckBox;

  @FindBy(how = ID, using = "includeCheckbox3")
  private static WebElement approvedQuantityCheckBox;

  @FindBy(how = ID, using = "includeCheckbox2")
  private static WebElement productCodeCheckBox;

  @FindBy(how = ID, using = "includeCheckbox5")
  private static WebElement orderDateCheckBox;

  @FindBy(how = ID, using = "includeCheckbox4")
  private static WebElement periodCheckBox;

  @FindBy(how = ID, using = "columnHeaderField0")
  private static WebElement orderNumberTextField;

  @FindBy(how = ID, using = "columnHeaderField1")
  private static WebElement facilityCodeTextField;

  @FindBy(how = ID, using = "columnHeaderField3")
  private static WebElement approvedQuantityTextField;

  @FindBy(how = ID, using = "columnHeaderField2")
  private static WebElement productCodeTextField;

  @FindBy(how = ID, using = "columnHeaderField5")
  private static WebElement orderDateTextField;

  @FindBy(how = ID, using = "columnHeaderField4")
  private static WebElement periodTextField;

  @FindBy(how = ID, using = "saveSuccessMsgDiv")
  private static WebElement successMessageDiv;

  @FindBy(how = XPATH, using = "//input[@value='Save']")
  private static WebElement saveButton;

  @FindBy(how = XPATH, using = "//a[contains(text(),'Cancel')]")
  private static WebElement cancelButton;

  @FindBy(how = XPATH, using = "//h2[contains(text(),'Order file')]")
  private static WebElement configureOrderFileHeader;

  @FindBy(how = XPATH, using = "//a[contains(text(),'+ Add new row')]")
  private static WebElement addNewButton;

  @FindBy(how = XPATH, using = "//div[@id='s2id_autogen19']/a/div/b")
  private static WebElement periodSelectBoxClickableLink;

  @FindBy(how = XPATH, using = "//div[@id='select2-drop']/div/input")
  private static WebElement periodSelectBoxTextField;

  @FindBy(how = XPATH, using = "//select[@ng-model='orderFileTemplate.orderConfiguration.periodDatePattern']")
  private static WebElement periodSelectBox;

  @FindBy(how = XPATH, using = "//div[@id='select2-drop']/ul/li[1]/div")
  private static WebElement periodSelectBoxSelectableElement;

  @FindBy(how = XPATH, using = "//div[@id='s2id_autogen21']/a/div/b")
  private static WebElement orderDateSelectBoxClickableLink;

  @FindBy(how = XPATH, using = "//div[@id='select2-drop']/div/input")
  private static WebElement orderDateSelectBoxTextField;

  @FindBy(how = XPATH, using = "//select[@ng-model='orderFileTemplate.orderConfiguration.datePattern']")
  private static WebElement orderDateSelectBox;

  @FindBy(how = XPATH, using = "//div[@id='select2-drop']/ul/li[1]/div")
  private static WebElement orderDateSelectBoxSelectableElement;

  @FindBy(how = XPATH, using = "//div[@id='s2id_autogen19']/a/span")
  private static WebElement periodSelectBoxDefaultSelected;

  @FindBy(how = XPATH, using = "//div[@id='s2id_autogen21']/a/span")
  private static WebElement orderDateSelectBoxDefaultSelected;




  public ConfigureOrderPage(TestWebDriver driver) throws IOException {
    super(driver);
    PageFactory.initElements(new AjaxElementLocatorFactory(TestWebDriver.getDriver(), 10), this);
    testWebDriver.setImplicitWait(10);
    testWebDriver.waitForElementToAppear(configureOrderFileHeader);
  }

  public String getOrderPrefix() {
    testWebDriver.waitForElementToAppear(orderFilePrefix);
    return testWebDriver.getAttribute(orderFilePrefix, "value");
  }

  public void clickAddNewButton()
  {
    testWebDriver.waitForElementToAppear(addNewButton);
    addNewButton.click();
    testWebDriver.sleep(250);
  }


  public String getSelectedOptionOfPeriodDropDown()
  {
    testWebDriver.waitForElementToAppear(periodSelectBoxDefaultSelected);
    return periodSelectBoxDefaultSelected.getText();
  }

  public String getSelectedOptionOfOrderDateDropDown()
  {
    testWebDriver.waitForElementToAppear(orderDateSelectBoxDefaultSelected);
    return orderDateSelectBoxDefaultSelected.getText();
  }

  public void selectValueFromPeriodDropDown(String value)
  {
    testWebDriver.waitForElementToAppear(periodSelectBoxClickableLink);
    periodSelectBoxClickableLink.click();
    testWebDriver.waitForElementToAppear(periodSelectBoxTextField);
    sendKeys(periodSelectBoxTextField,value);
    testWebDriver.waitForElementToAppear(periodSelectBoxSelectableElement);
    periodSelectBoxSelectableElement.click();
  }

  public void selectValueFromOrderDateDropDown(String value)
  {
    testWebDriver.waitForElementToAppear(orderDateSelectBoxClickableLink);
    orderDateSelectBoxClickableLink.click();
    testWebDriver.waitForElementToAppear(orderDateSelectBoxTextField);
    sendKeys(orderDateSelectBoxTextField,value);
    testWebDriver.waitForElementToAppear(orderDateSelectBoxSelectableElement);
    orderDateSelectBoxSelectableElement.click();
  }

  public List<String> getAllSelectOptionsOfPeriodDropDown()
  {
    testWebDriver.waitForElementToAppear(periodSelectBox);
    List<WebElement> elements=testWebDriver.getAllSelectedOptions(periodSelectBox);
    List<String> elementsValues=new ArrayList<String>();
    for(WebElement element:elements)
      elementsValues.add(element.getText());

    return elementsValues;
  }

  public List<String> getAllSelectOptionsOfOrderDateDropDown()
  {
    testWebDriver.waitForElementToAppear(orderDateSelectBox);
    List<WebElement> elements=testWebDriver.getAllSelectedOptions(orderDateSelectBox);
    List<String> elementsValues=new ArrayList<String>();
    for(WebElement element:elements)
      elementsValues.add(element.getText());

    return elementsValues;
  }


  public void clickRemoveIcon(int rowNumber)
  {
    testWebDriver.getElementByXpath("//a[@id='remove"+(rowNumber)+"']").click();
  }


  public void verifyElementsOnAddNewButtonClick(int row, String includeFlag, String dataField, String columnHeader)
  {
    testWebDriver.waitForElementToAppear(testWebDriver.getElementByXpath("//a[@id='remove"+(row)+"']"));
    assertTrue("Remove Button should show up", testWebDriver.getElementByXpath("//a[@id='remove" + (row) + "']").isDisplayed());
    if(includeFlag.equalsIgnoreCase("true"))
    assertTrue("Include flag for new row should be true",testWebDriver.getElementByXpath("//input[@id='includeCheckbox"+(row)+"']").isSelected());
    else
      assertFalse("Include flag for new row should be true", testWebDriver.getElementByXpath("//input[@id='includeCheckbox" + (row) + "']").isSelected());
    assertTrue("Data field for new row added should be : Not applicable",testWebDriver.getElementByXpath("//ul[@id='sortable']/li["+(row+1)+"]/div[2]/div/div[2]/span").getText().equalsIgnoreCase(dataField));
    assertTrue("Column header for new row added should be : blank",testWebDriver.getElementByXpath("//input[@id='columnHeaderField"+(row-1)+"']").getText().equals(columnHeader));

  }

  public boolean getIncludeOrderHeader() {
    testWebDriver.waitForElementToAppear(includeOrderHeaders);
    return includeOrderHeaders.isSelected();
  }

  public void checkIncludeOrderHeader() {
    testWebDriver.waitForElementToAppear(includeOrderHeaders);
    if (!includeOrderHeaders.isSelected())
      includeOrderHeaders.click();
  }

  public void unCheckIncludeOrderHeader() {
    testWebDriver.waitForElementToAppear(includeOrderHeaders);
    if (includeOrderHeaders.isSelected())
      includeOrderHeaders.click();
  }


  public boolean getOrderNumberCheckBox() {
    testWebDriver.waitForElementToAppear(orderNumberCheckBox);
    return orderNumberCheckBox.isSelected();
  }

  public void checkOrderNumberCheckBox() {
    testWebDriver.waitForElementToAppear(orderNumberCheckBox);
    if (!orderNumberCheckBox.isSelected())
      orderNumberCheckBox.click();
  }

  public void unCheckOrderNumberCheckBox() {
    testWebDriver.waitForElementToAppear(orderNumberCheckBox);
    if (orderNumberCheckBox.isSelected())
      orderNumberCheckBox.click();
  }

  public boolean getFacilityCodeCheckBox() {
    testWebDriver.waitForElementToAppear(facilityCodeCheckBox);
    return facilityCodeCheckBox.isSelected();
  }

  public void checkFacilityCodeCheckBox() {
    testWebDriver.waitForElementToAppear(facilityCodeCheckBox);
    if (!facilityCodeCheckBox.isSelected())
      facilityCodeCheckBox.click();
  }

  public void unCheckFacilityCodeCheckBox() {
    testWebDriver.waitForElementToAppear(facilityCodeCheckBox);
    if (facilityCodeCheckBox.isSelected())
      facilityCodeCheckBox.click();
  }

  public boolean getProductCodeCheckBox() {
    testWebDriver.waitForElementToAppear(productCodeCheckBox);
    return productCodeCheckBox.isSelected();
  }

  public void checkProductCodeCheckBox() {
    testWebDriver.waitForElementToAppear(productCodeCheckBox);
    if (!productCodeCheckBox.isSelected())
      productCodeCheckBox.click();
  }

  public void unCheckProductCodeCheckBox() {
    testWebDriver.waitForElementToAppear(productCodeCheckBox);
    if (productCodeCheckBox.isSelected())
      productCodeCheckBox.click();
  }

  public boolean getApprovedQuantityCheckBox() {
    testWebDriver.waitForElementToAppear(approvedQuantityCheckBox);
    return approvedQuantityCheckBox.isSelected();
  }

  public void checkApprovedQuantityCheckBox() {
    testWebDriver.waitForElementToAppear(approvedQuantityCheckBox);
    if (!approvedQuantityCheckBox.isSelected())
      approvedQuantityCheckBox.click();
  }

  public void unCheckApprovedQuantityCheckBox() {
    testWebDriver.waitForElementToAppear(approvedQuantityCheckBox);
    if (approvedQuantityCheckBox.isSelected())
      approvedQuantityCheckBox.click();
  }


  public boolean getPeriodCheckBox() {
    testWebDriver.waitForElementToAppear(periodCheckBox);
    return periodCheckBox.isSelected();
  }

  public void checkPeriodCheckBox() {
    testWebDriver.waitForElementToAppear(periodCheckBox);
    if (!periodCheckBox.isSelected())
      periodCheckBox.click();
  }

  public void unCheckPeriodCheckBox() {
    testWebDriver.waitForElementToAppear(periodCheckBox);
    if (periodCheckBox.isSelected())
      periodCheckBox.click();
  }

  public boolean getOrderDateCheckBox() {
    testWebDriver.waitForElementToAppear(orderDateCheckBox);
    return orderDateCheckBox.isSelected();
  }

  public void checkOrderDateCheckBox() {
    testWebDriver.waitForElementToAppear(orderDateCheckBox);
    if (!orderDateCheckBox.isSelected())
      orderDateCheckBox.click();
  }

  public void unCheckOrderDateCheckBox() {
    testWebDriver.waitForElementToAppear(orderDateCheckBox);
    if (orderDateCheckBox.isSelected())
      orderDateCheckBox.click();
  }

  public void setOrderPrefix(String value) {
    testWebDriver.waitForElementToAppear(orderFilePrefix);
    sendKeys(orderFilePrefix, value);
  }

  public String getFacilityCode() {
    testWebDriver.waitForElementToAppear(facilityCodeTextField);
    return testWebDriver.getAttribute(facilityCodeTextField, "value");
  }

  public void setFacilityCode(String value) {
    testWebDriver.waitForElementToAppear(facilityCodeTextField);
    sendKeys(facilityCodeTextField, value);
  }

  public void setOrderNumber(String value) {
    testWebDriver.waitForElementToAppear(orderNumberTextField);
    sendKeys(orderNumberTextField, value);
  }

  public String getOrderNumber() {
    testWebDriver.waitForElementToAppear(orderNumberTextField);
    return testWebDriver.getAttribute(orderNumberTextField,"value");
  }

  public String getApprovedQuantity() {
    testWebDriver.waitForElementToAppear(approvedQuantityTextField);
    return testWebDriver.getAttribute(approvedQuantityTextField, "value");
  }

  public void setApprovedQuantity(String value) {
    testWebDriver.waitForElementToAppear(approvedQuantityTextField);
    sendKeys(approvedQuantityTextField, value);
  }

  public String getProductCode() {
    testWebDriver.waitForElementToAppear(productCodeTextField);
    return testWebDriver.getAttribute(productCodeTextField, "value");
  }

  public void setProductCode(String value) {
    testWebDriver.waitForElementToAppear(productCodeTextField);
    sendKeys(productCodeTextField, value);
  }

  public String getOrderDate() {
    testWebDriver.waitForElementToAppear(orderDateTextField);
    return testWebDriver.getAttribute(orderDateTextField, "value");
  }

  public void setOrderDate(String value) {
    testWebDriver.waitForElementToAppear(orderDateTextField);
    sendKeys(orderDateTextField, value);
  }

  public String getPeriod() {
    testWebDriver.waitForElementToAppear(periodTextField);
    return testWebDriver.getAttribute(periodTextField, "value");
  }

  public void setPeriod(String value) {
    testWebDriver.waitForElementToAppear(periodTextField);
    sendKeys(periodTextField, value);
  }

  public void clickSaveButton() {
    testWebDriver.waitForElementToAppear(saveButton);
    saveButton.click();
  }

  public void clickCancelButton() {
    testWebDriver.waitForElementToAppear(cancelButton);
    cancelButton.click();
    testWebDriver.sleep(2000);
  }

  public void verifyColumnHeadersDisabled() {
    assertFalse("orderNumberTextField should be disabled", orderNumberTextField.isEnabled());
    assertFalse("facilityCodeTextField should be disabled", facilityCodeTextField.isEnabled());
    assertFalse("approvedQuantityTextField should be disabled", approvedQuantityTextField.isEnabled());
    assertFalse("productCodeTextField should be disabled", productCodeTextField.isEnabled());
    assertFalse("orderDateTextField should be disabled", orderDateTextField.isEnabled());
    assertFalse("periodTextField should be disabled", periodTextField.isEnabled());
  }

  public void verifyColumnHeadersEnabled() {
    assertTrue("orderNumberTextField should be enabled", orderNumberTextField.isEnabled());
    assertTrue("facilityCodeTextField should be enabled", facilityCodeTextField.isEnabled());
    assertTrue("approvedQuantityTextField should be enabled", approvedQuantityTextField.isEnabled());
    assertTrue("productCodeTextField should be enabled", productCodeTextField.isEnabled());
    assertTrue("orderDateTextField should be enabled", orderDateTextField.isEnabled());
    assertTrue("periodTextField should be enabled", periodTextField.isEnabled());
  }

  public void verifyIncludeCheckboxForAllColumnHeaders(String flag) {
    if (flag.equalsIgnoreCase("checked")) {
      assertFalse("orderNumberTextField should be checked", orderNumberTextField.isSelected());
      assertFalse("facilityCodeTextField should be disabled", facilityCodeTextField.isSelected());
      assertFalse("approvedQuantityTextField should be disabled", approvedQuantityTextField.isSelected());
      assertFalse("productCodeTextField should be disabled", productCodeTextField.isSelected());
      assertFalse("orderDateTextField should be disabled", orderDateTextField.isSelected());
      assertFalse("periodTextField should be disabled", periodTextField.isSelected());
    } else if (flag.equalsIgnoreCase("unchecked")) {
      assertTrue("orderNumberTextField should be checked", orderNumberTextField.isSelected());
      assertTrue("facilityCodeTextField should be disabled", facilityCodeTextField.isSelected());
      assertTrue("approvedQuantityTextField should be disabled", approvedQuantityTextField.isSelected());
      assertTrue("productCodeTextField should be disabled", productCodeTextField.isSelected());
      assertTrue("orderDateTextField should be disabled", orderDateTextField.isSelected());
      assertTrue("periodTextField should be disabled", periodTextField.isSelected());
    }

  }

  public void verifySuccessMessage(String message) {
    testWebDriver.waitForElementToAppear(successMessageDiv);
    assertEquals(successMessageDiv.getText(), message);
  }


}