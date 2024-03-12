package app;

import javafx.fxml.FXML;
import javafx.scene.layout.GridPane;
import javafx.scene.Node;
import javafx.scene.input.MouseEvent;

public class ModelController {

  @FXML
  void onSquareClick(MouseEvent event) {
    final Node target = (Node) event.getSource();
    System.out.println("Row: " + GridPane.getRowIndex(target));
    System.out.println("Column: " + GridPane.getColumnIndex(target));
    System.out.println("Hello");

  }

}
