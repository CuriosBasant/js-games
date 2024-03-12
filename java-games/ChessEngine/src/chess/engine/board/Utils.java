package chess.engine.board;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Utils
 */
public class Utils {
  public static final int PER_ROW = 8;
  public static final int TOT_SQUARES = 64;
  private static String[] ALGEBREIC_NOTATION = initializeAlgebreicNotation();
  private static Map<String, Integer> POSITION_TO_INDEX = initializePositionToIndexMap();

  private Utils() {
    throw new RuntimeException("Not Instantiable.");
  }

  private static String[] initializeAlgebreicNotation() {
    return new String[] { "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7",
        "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4",
        "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2",
        "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1" };
  }

  private static Map<String, Integer> initializePositionToIndexMap() {
    final Map<String, Integer> positionToIndex = new HashMap<>();

    for (int i = 0; i < TOT_SQUARES; i++) {
      positionToIndex.put(ALGEBREIC_NOTATION[i], i);
    }
    return Collections.unmodifiableMap(positionToIndex);
  }

  public static boolean FIRST_COLUMN(final int index) {
    return index % 8 == 0;
  }

  public static boolean SECOND_COLUMN(final int index) {
    return index % 8 == 1;
  }

  public static boolean SEVENTH_COLUMN(final int index) {
    return index % 8 == 6;
  }

  public static boolean EIGHTH_COLUMN(final int index) {
    return index % 8 == 7;
  }

  public static boolean isValidSquareIndex(final int index) {
    return index >= 0 && index < TOT_SQUARES;
  }

  public static int getIndexAtPosition(final String position) {
    return POSITION_TO_INDEX.get(position);
  }

  public static String getPositionAtIndex(final int index) {
    return ALGEBREIC_NOTATION[index];
  }
}